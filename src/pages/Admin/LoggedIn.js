import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import NewGrid from './createGrid/NewGrid';
import AllGrids from './AllMazes/AllGrids';
import AdminHome from './AdminHome';

export default function LoggedIn () {

    return (

        <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
            <Tab eventKey="home" title="Home">
                <AdminHome />
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