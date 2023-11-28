const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { User, Url } = require('../models/db.js');

const authorizationMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];

    try {
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.slice(7);
            const user = await User.findOne({ key: token });

            if (user) {
                req.user = { result: user };
                next();
            } else {
                res.status(401).json({ error: 'Unauthorized' });
            }
        } else {
            res.status(401).json({ error: 'Unauthorized' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/short-url:
 *   post:
 *     summary: Create a short URL
 *     tags:
 *       - URL
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Data saved successfully
 *               url: localhost:3000/abc123
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

router.post('/short-url', authorizationMiddleware, async (req, res) => {
    const { url } = req.body;
    const hash = crypto.createHash('sha256').update(url).digest('base64');
    const filteredHash = hash.replace(/\//g, '_').replace(/\+/g, '-');
    const shortIdentifier = filteredHash.substring(0, 6);
    const userId = req.user.result.id;
    const short_url = 'localhost:3000/' + shortIdentifier;

    const newUrl = new Url({
        userId: userId,
        key: shortIdentifier,
        long_url: url,
        short_url: short_url
    });

    try {
        const existingUrl = await Url.findOne({ long_url: url });

        if (existingUrl) {
            return res.json({ message: "URL is already used", url: existingUrl.short_url });
        }

        await newUrl.save();

        // Update the User document to include the reference to the new Url document
        const updatedUser = await User.findByIdAndUpdate(userId, { $push: { urls: newUrl._id } }, { new: true });

        res.status(200).json({ message: "Data saved successfully", url: short_url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @swagger
 * /api/list-url:
 *   get:
 *     summary: Get a list of short URLs
 *     tags:
 *       - URL
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of short URLs
 *         content:
 *           application/json:
 *             example:
 *               - localhost:3000/abc123
 *               - localhost:3000/def456
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

 router.get('/list-url', authorizationMiddleware, async (req, res) => {
    const userId = req.user.result.id;

    try {
        const user = await User.findById(userId);

        if (user) {
            const urlPromises = user.urls.map(async element => {
                const url = await Url.findById(element);
                return { link: url.short_url, id: url._id };
            });

            const results = await Promise.all(urlPromises);

            res.status(200).json(results);
        } else {
            res.status(500).json({ error: 'Data not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred.' });
    }
});


/**
 * @swagger
 * /api/url/{id}:
 *   delete:
 *     summary: Delete a short URL by ID
 *     tags:
 *       - URL
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the short URL to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               deleted: true
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               error: Unauthorized
 *       404:
 *         description: URL not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

router.delete('/url/:id', authorizationMiddleware, async (req, res) => {
    const urlId = req.params.id;
    const userId = req.user.result.id;

    try {
        await Url.findOneAndDelete({ _id: urlId });
        const updatedUser = await User.findByIdAndUpdate(userId, { $pull: { urls: urlId } }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ deleted: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
