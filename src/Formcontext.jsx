import { createContext, useState, useContext } from "react";

// 1. Create the context
const FormContext = createContext();

// 2. Create the provider
export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    job_title: "",
    salary_expectation: {
      amount: 0,
      type: "salary",
    },
    skills: [],
    remote_type: "",
    location: "",
    benefits: [],
    career_level: "",
    work_type: "",
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};


// 3. Custom hook to use the context
export const useFormData = () => useContext(FormContext);
