import { useState } from "react";

const AddInput = () => {

    const [inputValue, setInputValue ] = useState(""); 
    
    // Handle changes to the input field
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    // Handle form submission
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent page refresh
        console.log('Submitted value:', inputValue);
        // Reset the input field
        setInputValue('');
    };
    
    return (
        <form onSubmit={handleSubmit}>
          <label>
            Enter text:
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
    );
};

export default AddInput