// const express = require('express');
// const router = express.Router();
import express from "express";
const tourController = express.Router();

import { getAllTours, getTourById, createTour, deleteTourById, editTourById } from './tour.service'


tourController.get("/:tourId", async (req, res) => {
    try {
        const tourId = req.params.tourId;
        const tour = await getTourById(tourId);
        res.status(200).json(tour);
    } catch (error) {
        if (error instanceof Error) {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }

});


tourController.post('/', async (req, res) => {

    try {
        const newTourData = req.body;
        const tour = await createTour(newTourData);

        res.status(201).send({ msg: "New Tour Successfully Created !", data: tour });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }

});

tourController.delete("/:tourId", async (req, res) => {

    try {
        const id = req.params.tourId;

        await deleteTourById(id);

        res.status(200).send("Delete Tour Successfull !");
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }

});


tourController.put("/:tourId", async (req, res) => {
    const id = req.params.tourId;
    const tourData = req.body;


    try {

        if (!(tourData.status && tourData.name && tourData.slug && tourData.price && tourData.image && tourData.description)) {
            return res.status(400).send({ msg: "Some Field is Missing !" });
        }

        const updateTour = await editTourById(id, tourData);

        res.status(200).send({
            msg: "Update Tour Successful !",
            data: updateTour,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }

});


tourController.patch("/:tourId", async (req, res) => {
    const id = req.params.tourId;
    const tourData = req.body;

    try {
        const updateTour = await editTourById(id, tourData);

        res.status(200).send({
            msg: "Update Tour Successful !",
            data: updateTour,
        });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(400).send({ error: error.message });
        } else {
            res.status(500).send("Unexpected error occurred.");
        }
    }
});




tourController.get("/", async (req, res) => {
    const tours = await getAllTours();

    res.send(tours);
});

export default tourController;