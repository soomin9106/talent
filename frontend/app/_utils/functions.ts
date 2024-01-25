import axios from "axios";
import { CellPost } from "../_const/interfaces";

export const handleChange = (event: { target: { value: any; }; }, setValue: (arg0: any) => void) => {
    setValue(event.target.value)
}

export const getCells = async () => {
    const response = await axios.get('http://localhost:8000/cells')

    return response.data
}

export const addCell = async ({ name }: CellPost) => {
    const payload = {
        name
    }
    const response = await axios.post('http://localhost:8000/cell', payload)

    return response
}