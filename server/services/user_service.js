const db = require('../db');
const bcrypt = require('bcryptjs');
const tokenService = require('./token_service');
const mailService = require('./mail_service');
const ApiError = require('../exceptions/api_error');
const types = require('pg').types;

class UserService {
    constructor() {
        types.setTypeParser(1114, str => str);
    }

    async getUserInfo(id) {
        const user = (await db.query("SELECT * FROM users WHERE user_id = $1", [id])).rows[0];
        return user;
    }

    async getResultsOfSolvingTests(id) {
        const results = (await db.query("SELECT * FROM results_of_solving_tests WHERE user_id = $1 ORDER BY date_of_solving DESC", [id])).rows;
        return results;
    }

    async getResultsOfSolvingProblems(id) {
        const results = (await db.query("SELECT * FROM results_of_solving_problems WHERE user_id = $1 ORDER BY date_of_solving DESC", [id])).rows;
        return results;
    }

    async getTotalPointsForSolvingTests(id) {
        const totalPointsForSolvingTests = (await db.query("SELECT SUM(result_points) FROM results_of_solving_tests WHERE user_id = $1", [id])).rows[0].sum;
        return totalPointsForSolvingTests ? Number(totalPointsForSolvingTests) : 0;
    }

    async getTotalPointsForSolvingProblems(id) {
        const totalPointsForSolvingProblems = (await db.query("SELECT SUM(all_max_points.max_points) FROM (SELECT MAX(result_points) AS max_points FROM results_of_solving_problems WHERE user_id = $1 GROUP BY problem_id) AS all_max_points", [id])).rows[0].sum;
        return (totalPointsForSolvingProblems ? Number(totalPointsForSolvingProblems) : 0);
    }

    async updatePersonalInfo(id, username, email, password, isEmailConfirmed) {
        const user = (await db.query('SELECT * FROM Users WHERE user_id = $1', [id])).rows;
        if (user[0].user_role !== 'USER') {
            throw ApiError.BadRequest('Выбранный пользователь не является пользователем!');
        }
        if (password === '' && user[0].user_name === username && user[0].user_email === email) {
            throw ApiError.BadRequest('Вы не изменили данные!');
        }
        const usernameExists = (await db.query('SELECT * FROM Users WHERE user_name LIKE $1 AND NOT (user_id = $2)', [username, id])).rows.length > 0;
        if (usernameExists) {
            throw ApiError.BadRequest('Учетная запись с таким именем уже существует!');
        }
        const emailExists = (await db.query('SELECT * FROM Users WHERE user_email LIKE $1 AND NOT (user_id = $2)', [email, id])).rows.length > 0;
        if (emailExists) {
            throw ApiError.BadRequest('На данную почту уже заведена учетная запись!');
        }
        let isConfirmed = null;
        if (user[0].user_email !== email) {
            const confirmationToken = tokenService.genereteConfirmationToken({ userId: id }, process.env.JWT_CONFIRMATION_SECRET);
            const confirmationLink = `${process.env.API_URL}/api/activate/${confirmationToken}`;
            mailService.sendActivationMail(email, username, confirmationLink);
            isConfirmed = false;
        }
        else {
            isConfirmed = isEmailConfirmed;
        }
        let updatedUser = null;
        if (password === '') {
            updatedUser = (await db.query('UPDATE Users SET user_name = $1, user_email = $2, is_confirmed = $3 WHERE user_id = $4 RETURNING *', [username, email, isConfirmed, id])).rows[0];
        }
        else {
            const hashPassword = bcrypt.hashSync(password, 7);
            updatedUser = (await db.query('UPDATE Users SET user_name = $1, user_email = $2, user_password = $3, is_confirmed = $4 WHERE user_id = $5 RETURNING *', [username, email, hashPassword, isConfirmed, id])).rows[0];
        }
        return updatedUser;
    }
}

module.exports = new UserService();