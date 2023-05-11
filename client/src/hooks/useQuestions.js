import { useMemo } from "react";

const useFilteredQuestions = (questions, filterTheory, filterInteractive) => {
    const filteredQuestions = useMemo(() => {
        if (filterTheory && !filterInteractive) {
            return [...questions].filter((question) => question.question_type === 'теоретический');
        }
        if (!filterTheory && filterInteractive) {
            return [...questions].filter((question) => question.question_type === 'интерактивный');
        }
        return questions;
    }, [filterTheory, filterInteractive, questions]);

    return filteredQuestions;
};

const useSortedQuestions = (questions, sort) => {
    const sortedQuestions = useMemo(() => {
        if (sort && sort === 'up') {
            return [...questions].sort((a, b) => a.question_points > b.question_points ? 1 : -1);
        }
        else if (sort && sort === 'down') {
            return [...questions].sort((a, b) => a.question_points < b.question_points ? 1 : -1);
        }
        return questions;
    }, [sort, questions]);

    return sortedQuestions;
};

export const useQuestions = (questions, filterTheory, filterInteractive, sort, query) => {
    const filteredQuestions = useFilteredQuestions(questions, filterTheory, filterInteractive);
    const sortedQuestions = useSortedQuestions(filteredQuestions, sort);
    const sortedFilteredAndSearchedQuestions = useMemo(() => {
        return sortedQuestions.filter(question =>  question.question_text.toLowerCase().includes(query.toLowerCase()));
    }, [query, sortedQuestions]);

    return sortedFilteredAndSearchedQuestions;
};