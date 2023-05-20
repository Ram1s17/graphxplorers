const db = require('../db');

class EvaluationCriteriaService {
    async getEvaluationCriteria(id) {
        const evaluationCriteria = (await db.query("SELECT * FROM evaluation_criteria WHERE criteria_id IN (SELECT criteria_id FROM problems_evaluation_criteria WHERE problem_id = $1)", [id])).rows;
        return evaluationCriteria;
    }

    async addEvaluationCriteria(problemID, evaluationCriteria) {
        const searchedCriteria = (await db.query("SELECT * FROM evaluation_criteria WHERE points = $1 AND max_count_of_path_mistakes = $2 AND max_count_of_new_capacities_mistakes = $3 AND max_count_of_current_flow_mistakes = $4 AND max_count_of_min_cut_mistakes = $5",
            [evaluationCriteria.points,
            evaluationCriteria.max_count_of_path_mistakes,
            evaluationCriteria.max_count_of_new_capacities_mistakes,
            evaluationCriteria.max_count_of_current_flow_mistakes,
            evaluationCriteria.max_count_of_min_cut_mistakes])).rows;
        let evaluationCriteriaID = null;
        if (searchedCriteria.length === 0) {
            const newEvaluationCriteria = (await db.query("INSERT INTO evaluation_criteria (points, max_count_of_path_mistakes, max_count_of_new_capacities_mistakes, max_count_of_current_flow_mistakes, max_count_of_min_cut_mistakes) VALUES ($1, $2, $3, $4, $5) RETURNING *",
                [evaluationCriteria.points,
                evaluationCriteria.max_count_of_path_mistakes,
                evaluationCriteria.max_count_of_new_capacities_mistakes,
                evaluationCriteria.max_count_of_current_flow_mistakes,
                evaluationCriteria.max_count_of_min_cut_mistakes])).rows[0];
            evaluationCriteriaID = newEvaluationCriteria.criteria_id;
        }
        else {
            evaluationCriteriaID = searchedCriteria[0].criteria_id;
        }
        await db.query("INSERT INTO problems_evaluation_criteria (problem_id, criteria_id) VALUES ($1, $2)",
            [problemID, evaluationCriteriaID]);
    }

    async deleteEvaluationCriteria(problemID, evaluationCriteriaID) {
        const searchedCriteria = (await db.query("SELECT * FROM problems_evaluation_criteria WHERE NOT(problem_id = $1) AND criteria_id = $2",
            [problemID, evaluationCriteriaID])).rows;
        if (searchedCriteria.length === 0) {
            await db.query('DELETE FROM evaluation_criteria WHERE criteria_id = $1', [evaluationCriteriaID]);
        }
        else {
            await db.query('DELETE FROM problems_evaluation_criteria WHERE problem_id = $1 AND criteria_id = $2', [problemID, evaluationCriteriaID]);
        }
    }
}

module.exports = new EvaluationCriteriaService();