import { error } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

export const dataFilePath = path.resolve('data/registrace.json');
export const boatsFilePath = path.resolve('data/boats.json')
// Function to read registrations from the JSON file
async function readData(path){
    try {
        const data = await fs.readFile(path, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        // @ts-ignore
        if (err.code === 'ENOENT') {
            // If the file does not exist, return an empty array
            await fs.writeFile(dataFilePath, JSON.stringify([]));
            return [];
        } else {
            throw error(500, 'Error reading files');
        }
}
}
export async function readRegistrations() {

    return readData(dataFilePath);
}

export async function readBoats() {

    return readData(boatsFilePath);
}