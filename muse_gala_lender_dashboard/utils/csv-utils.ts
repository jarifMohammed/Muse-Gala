export const generateCSVTemplate = (): string => {
    const headers = [
      "Dress Name",
      "Brand",
      "Size",
      "Color",
      "Condition",
      "Category",
      "Pickup Address",
      "Rental Price (4 days)",
      "Rental Price (8 days)",
      "Description",
      "Materials",
      "Care Instructions",
    ].join(",")
  
    const exampleRow = [
      "Elegant Evening Gown",
      "Zimmermann",
      "M",
      "Black",
      "New",
      "Formal",
      "123 Fashion Ln, Sydney NSW 2000",
      "40",
      "70",
      "Beautiful silk gown perfect for formal occasions",
      "100% Silk",
      "Dry clean only",
    ].join(",")
  
    return `${headers}\n${exampleRow}`
  }
  
  export const parseCSV = (csvContent: string): any[] => {
    const lines = csvContent.trim().split("\n")
    const headers = lines[0].split(",").map((header) => header.trim())
  
    return lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim())
      const obj: Record<string, string> = {}
  
      headers.forEach((header, index) => {
        obj[header] = values[index] || ""
      })
  
      return obj
    })
  }
  
  export const downloadCSV = (filename: string, content: string): void => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
  
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
  
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  