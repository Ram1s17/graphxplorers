import { useMemo } from "react";

const useFilteredTestResults= (testResults, filter) => {
    const filteredTestResults = useMemo(() => {
        if (filter && filter === 'theoretical') {
            return [...testResults].filter((result) => result.type_of_test === 'теоретический');
        }
        else if (filter && filter === 'interactive') {
            return [...testResults].filter((result) => result.type_of_test === 'интерактивный');
        }
        else if (filter && filter === 'mix') {
            return [...testResults].filter((result) => result.type_of_test === 'общий');
        }
        return testResults;
    }, [filter, testResults]);

    return filteredTestResults;
};

const useSortedTestResults = (testResults, sort) => {
    const sortedTestResults = useMemo(() => {
        if (sort && sort === 'up') {
            return [...testResults].sort((a, b) => a.result_points > b.result_points ? 1 : -1);
        }
        else if (sort && sort === 'down') {
            return [...testResults].sort((a, b) => a.result_points < b.result_points ? 1 : -1);
        }
        return testResults;
    }, [sort, testResults]);

    return sortedTestResults;
};

export const useTestResults = (testResults, dateQuery, filter, sort) => {
    const filteredTestResults = useFilteredTestResults(testResults, filter);
    const sortedTestResults = useSortedTestResults(filteredTestResults, sort);
    const sortedFilteredAndSearchedTestResults = useMemo(() => {
        if (dateQuery)
            return sortedTestResults.filter(result =>  result.date_of_solving.split('T')[0] === dateQuery);
        return sortedTestResults;
    }, [dateQuery, sortedTestResults]);

    return sortedFilteredAndSearchedTestResults;
};