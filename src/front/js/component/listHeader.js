import React, { Component } from "react";
import { Link } from "react-router-dom";

export const ListHeader = () => (
    <div className="d-flex justify-content-between">
        <div className="list-header">
            <h2>List:</h2>
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
            <button className="btn btn-primary me-md-2" type="button">Share list</button>
            <button className="btn btn-primary" type="button">Add item +</button>
        </div>
    </div>
);