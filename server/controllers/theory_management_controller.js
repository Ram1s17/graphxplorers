const fs = require('fs');

class TheoryManagementController {
    async saveTheory(req, res, next) {
        try {
            const { content } = req.body;
            fs.writeFileSync('content/theory.html', content);
            return res.status(200).json('Теоретические материалы сохранены');
        } catch (e) {
            next(e);
        }
    }

    async getTheory(req, res, next) {
        try {
            const content = fs.readFileSync('content/theory.html', 'utf-8');
            return res.status(200).json(content);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TheoryManagementController();