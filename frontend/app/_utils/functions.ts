import axios from "axios";
import { CellPost, CellUpdate, ChildGet, ChildrenGet, IStudentInfo } from "../_const/interfaces";

export const handleChange = (event: { target: { value: any; }; }, setValue: (arg0: any) => void) => {
    setValue(event.target.value)
}

export const getCells = async () => {
    try {
        const response = await axios.get('http://localhost:8000/cells');
        return response.data;
    } catch (error) {
        console.error('Error fetching cells:', error);
        return [];
    }
};

export const getCellsById = async ({ cell_id }: ChildrenGet) => {
    try {
        const response = await axios.get(`http://localhost:8000/cell/${cell_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cell by ID:', error);
        return {};
    }
};

export const addCell = async ({ name }: CellPost) => {
    try {
        const payload = {
            name
        };
        const response = await axios.post('http://localhost:8000/cell', payload);
        return response;
    } catch (error) {
        console.error('Error adding cell:', error);
        throw error; // Optionally rethrow the error if needed
    }
};

export const editCell = async ({ id, name }: CellUpdate) => {
    try {
        const payload = {
            id,
            name
        };
        const response = await axios.put('http://localhost:8000/cell', payload);
        return response;
    } catch (error) {
        console.error('Error adding cell:', error);
        throw error; // Optionally rethrow the error if needed
    }
};

export const getChildren = async ({ cell_id }: ChildrenGet) => {
    try {
        const response = await axios.get(`http://localhost:8000/children/${cell_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching children:', error);
        return [];
    }
};

export const addChild = async (cell_id: number, props: IStudentInfo) => {
    try {
        const payload = {
            name: props.name,
            grade: Number(props.grade),
            zone: props.zone,
            talent: Number(props.talent),
        };
        const response = await axios.post(`http://localhost:8000/child/${cell_id}`, payload);
        return response;
    } catch (error) {
        console.error('Error adding child:', error);
        throw error; // Optionally rethrow the error if needed
    }
};

export const editChild = async (student_id: number, props: IStudentInfo) => {
    try {
        const payload = {
            name: props.name,
            grade: Number(props.grade),
            zone: props.zone,
            talent: Number(props.talent),
        };
        const response = await axios.put(`http://localhost:8000/child/${student_id}`, payload);
        return response;
    } catch (error) {
        console.error('Error adding child:', error);
        throw error; // Optionally rethrow the error if needed
    }
};

export const getChild = async ({ student_id }: ChildGet) => {
    try {
        const response = await axios.get(`http://localhost:8000/child/${student_id}`);
        if (response.status === 200) {
            return response.data;
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error fetching child:', error);
        return {};
    }
};
