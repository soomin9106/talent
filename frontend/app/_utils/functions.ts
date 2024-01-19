export const handleChange = (event: { target: { value: any; }; }, setValue: (arg0: any) => void) => {
    setValue(event.target.value)
}