import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import NewGrid from './createGrid/NewGrid';
import AllGrids from './AllMazes/AllGrids';

export default function LoggedIn () {

    return (

        <Tabs defaultActiveKey="new-grid" id="uncontrolled-tab-example">
            <Tab eventKey="home" title="Home">
                home
            </Tab>
            <Tab eventKey="new-grid" title="new grid">
                <NewGrid />
            </Tab>
            <Tab eventKey="all-grids" title="all grids">
               <AllGrids />
            </Tab>
        </Tabs>

    )

}