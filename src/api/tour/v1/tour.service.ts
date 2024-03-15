import { findTours, findTourById, insertTour, findTourByName, deleteTour, updateTourById } from "./tour.repository";
import { Tour } from "@prisma/client";


export const getAllTours = async (): Promise<Tour[]> => {

    const tours = await findTours();

    if (tours.length === 0) {
        throw new Error('No Tour found !')
    }

    return tours;
}

export const getTourById = async (id: string): Promise<Tour | null> => {

    const tour = await findTourById(id)

    if (!tour) {
        // return res.status(400).send({ msg: "Sorry Tour Doesn't exits" });
        throw Error('Tour is Not Found');
    }

    return tour;
}

export const createTour = async (newTourData: Tour): Promise<Tour | null> => {

    const findTour = await findTourByName(newTourData.name);

    if (findTour) {
        throw new Error('Tour already exists, must be change');
    }

    const tour = await insertTour(newTourData);

    return tour;
}

export const deleteTourById = async (id: string): Promise<void> => {
    try {
        await getTourById(id);

        await deleteTour(id);
    } catch (error) {
        throw error;
    }

};

export const editTourById = async (id: string, tourData: Tour): Promise<Tour | null> => {
    await getTourById(id);

    const tour = await updateTourById(id, tourData);

    return tour;

}



// export default{
//     getAllTours,
//     getTourById,
//     createTour,
//     deleteTourById,
//     editTourById,
// }