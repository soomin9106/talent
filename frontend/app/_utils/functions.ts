import axios from "axios";
import { CellPost, ChildrenGet, IStudentInfo } from "../_const/interfaces";

export const handleChange = (event: { target: { value: any; }; }, setValue: (arg0: any) => void) => {
    setValue(event.target.value)
}

export const getCells = async () => {
    const response = await axios.get('http://localhost:8000/cells')

    return response.data
}

export const getCellsById = async ({ cell_id }: ChildrenGet) => {
    const response = await axios.get(`http://localhost:8000/cell/${cell_id}`)

    return response.data
}

export const addCell = async ({ name }: CellPost) => {
    const payload = {
        name
    }
    const response = await axios.post('http://localhost:8000/cell', payload)

    return response
}

export const getChildren = async({ cell_id }: ChildrenGet) => {
    const response = await axios.get(`http://localhost:8000/children/${cell_id}`)

    return response.data
}

export const addChild = async (cell_id: number, props: IStudentInfo) => {
    const payload = {
        name: props.name,
        grade: Number(props.grade),
        zone: props.zone,
        talent: Number(props.talent),
    }
    const response = await axios.post(`http://localhost:8000/child/${cell_id}`, payload)

    return response
}