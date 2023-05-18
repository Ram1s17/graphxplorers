import { useMemo } from "react";

const useSearchedProblemResults= (problemResults, query) => {
    const searchedTestResults = useMemo(() => {
        return [...problemResults].filter(result => String(result.problem_id).includes(query));
    }, [query, problemResults]);

    return searchedTestResults;
};

const useSortedProblemResults = (problemResults, sort) => {
    const sortedProblemResults = useMemo(() => {
        if (sort && sort === 'up') {
            return [...problemResults].sort((a, b) => a.result_points > b.result_points ? 1 : -1);
        }
        else if (sort && sort === 'down') {
            return [...problemResults].sort((a, b) => a.result_points < b.result_points ? 1 : -1);
        }
        return problemResults;
    }, [sort, problemResults]);

    return sortedProblemResults;
};

export const useProblemResults = (problemResults, dateQuery, query, sort) => {
    const searchedProblemResults = useSearchedProblemResults(problemResults, query);
    const sortedProblemResults = useSortedProblemResults(searchedProblemResults, sort);
    const sortedAndSearchedProblemResults = useMemo(() => {
        if (dateQuery)
            return sortedProblemResults.filter(result =>  result.date_of_solving.split('T')[0] === dateQuery);
        return sortedProblemResults;
    }, [dateQuery, sortedProblemResults]);

    return sortedAndSearchedProblemResults;
};