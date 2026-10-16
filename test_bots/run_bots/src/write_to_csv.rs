use csv::Writer;

use crate::ToStringVector;


pub fn write_to_file<T, I, S>(values: &Vec<T>, file_name: &str, header: I) -> Result<(),  Box<dyn std::error::Error>> 
where 
    T: ToStringVector, 
    S: AsRef<[u8]>,
    I: IntoIterator<Item = S>,
{
    let mut wrt = Writer::from_path(file_name)?;
    
    // Write header
    wrt.write_record(header)?;

    for value in values {
        wrt.write_record(&value.to_string_vector())?;
    }

    wrt.flush()?;

    Ok(())
}