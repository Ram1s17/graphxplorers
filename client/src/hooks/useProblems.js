import { useMemo } from "react";

const useFilteredProblems = (problems, filterEasy, filterHard) => {
    const filteredProblems = useMemo(() => {
        if (filterEasy && !filterHard) {
            return [...problems].filter((problem) => problem.complexity === 'легко');
        }
        if (!filterEasy && filterHard) {
            return [...problems].filter((problem) => problem.complexity === 'сложно');
        }
        return problems;
    }, [filterEasy, filterHard, problems]);

    return filteredProblems;
};

const useSortedProblems = (problems, sort) => {
    const sortedProblems = useMemo(() => {
        if (sort && sort === 'up') {
            return [...problems].sort((a, b) => a.points > b.points ? 1 : -1);
        }
        else if (sort && sort === 'down') {
            return [...problems].sort((a, b) => a.points < b.points ? 1 : -1);
        }
        return problems;
    }, [sort, problems]);

    return sortedProblems;
};

export const useProblems = (problems, filterEasy, filterHard, sort, query) => {
    const filteredProblems = useFilteredProblems(problems, filterEasy, filterHard)
    const sortedProblems = useSortedProblems(filteredProblems, sort);
    const sortedFilteredAndSearchedProblems = useMemo(() => {
        return sortedProblems.filter(problem => String(problem.problem_id).includes(query));
    }, [query, sortedProblems]);

    return sortedFilteredAndSearchedProblems;
};