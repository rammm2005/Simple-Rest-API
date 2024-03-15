import prisma from '../../../db/server';
import { Tour } from '@prisma/client';

export const findTours = async (): Promise<Tour[]> =>  {
    const tours = await prisma.tour.findMany();

    return tours;
}

export const findTourById = async (id: string): Promise<Tour | null> =>{
    const tour = await prisma.tour.findUnique({
        where: {
            id,
        },
    });

    return tour;
}

export const findTourByName = async (name: string): Promise<Tour | null> => {
    const tour = await prisma.tour.findFirst({
        where: {
            name: name,
        },
    });

    return tour;
}

export const insertTour = async (newTourData: Tour): Promise<Tour> => {
    const tour = await prisma.tour.create({
        data: {
            name: newTourData.name,
            description: newTourData.description,
            slug: newTourData.slug,
            price: newTourData.price,
            image: newTourData.image,
            status: newTourData.status,
        }
    });

    return tour;
}

export const deleteTour = async (id: string): Promise<void> => {
    await prisma.tour.delete({
        where: {
            id,
        }
    });
}

export const updateTourById = async (id: string, tourData: Tour): Promise<Tour | null> => {
    const updateTour = await prisma.tour.update({
        where: {
            id,
        },
        data: {
            name: tourData.name,
            description: tourData.description,
            slug: tourData.slug,
            price: tourData.price,
            image: tourData.image,
            status: tourData.status,
        },
    });

    return updateTour;
}



// export default {
//     findTours,
//     findTourById,
//     insertTour,
//     findTourByName,
//     deleteTour,
//     updateTourById
// }