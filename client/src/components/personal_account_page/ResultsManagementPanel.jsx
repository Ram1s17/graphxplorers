import React from "react";
import { Row, Col } from "react-bootstrap";
import SearchBar from "../common/UI/SearchBar";
import SortBarWithoutLabel from "../common/UI/SortBarWithoutLabel";
import DateSearchBar from "../common/UI/DateSearchBar";
import TestTypeFilterBar from "../common/UI/TestTypeFilterBar";

const ResultsManagementPanel = ({ testListParametrs, setTestListParametrs, problemListParametrs, setProblemListParametrs }) => {
    return (
        <Row className="d-flex justify-content-evenly align-items-center mb-3">
            <Col xl={5} className='rounded-4 main-border p-3 d-flex justify-content-between align-items-center'>
                <DateSearchBar parametrs={testListParametrs} setParametrs={setTestListParametrs} />
                <TestTypeFilterBar parametrs={testListParametrs} setParametrs={setTestListParametrs} />
                <SortBarWithoutLabel parametrs={testListParametrs} setParametrs={setTestListParametrs} />
            </Col>
            <Col xl={5} className='rounded-4 main-border p-3 d-flex justify-content-evenly align-items-center'>
                <DateSearchBar parametrs={problemListParametrs} setParametrs={setProblemListParametrs} />
                <SearchBar parametrs={problemListParametrs} setParametrs={setProblemListParametrs} />
                <SortBarWithoutLabel parametrs={problemListParametrs} setParametrs={setProblemListParametrs} />
            </Col>
        </Row>
    );
};

export default ResultsManagementPanel;