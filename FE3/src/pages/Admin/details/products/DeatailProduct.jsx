import AdminNavbars from "../../../components/Admin/navbar/AdminNavbar";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import "./detailproduct.scss"
import { Box, Button, Container, FormControl, FormControlLabel, FormLabel, Grid, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { useState } from 'react';
import { useNavigate } from "react-router";

const DetailsProduct = ({inputs,title}) => {
  const [cate, setCate] = useState("10");
  const [value, setValue] = useState("1");

  const handleChangeCate = (event) => {
    setCate(event.target.value);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  let navigate = useNavigate();

  return (
    <div className="home">
            <AdminSidebar id={1} />
            <div className="homeContainer">
                <AdminNavbars title="Details Product" />
                <div className="details sm md">
              <div className="left">
              <img src={require('../../../../assets/images/no-image-icon-0.jpg')} alt=""/>
              </div>
              <div className="right">
                <Container>
                    <Paper>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={12} sx={{margin:0.5}}>
                          <TextField label= "Product ID"type="text" fullWidth size="small" name="productid" value="0101111" InputProps={{readOnly: true}} InputLabelProps={{shrink: true}}
                          ></TextField>
                        </Grid>
                        {inputs.map(input=>(
                          <Grid item xs={12} md={12} sx={{margin:0.5}} key={input.id}>
                          <TextField label={input.label} type={input.type} fullWidth size="small" name={input.name} placeholder={input.placeholder} InputProps={{readOnly: true}} InputLabelProps={{shrink: true}}
                          ></TextField>
                        </Grid>
                        ))}
                      <Grid item xs={12} md={12} sx={{margin:0.5}}>
                        <TextField label="Long Description" type="text" fullWidth size="small" name="longdescription" placeholder="......" InputProps={{readOnly: true}} InputLabelProps={{shrink: true}} multiline
                        ></TextField>
                      </Grid>
                      </Grid>
                      <Grid item xs={12} md={12} sx={{margin:0.5}}>
                      <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={cate}
                          label="Category"
                          onChange={handleChangeCate}
                          disabled
                        >
                          <MenuItem value={10}>Ten</MenuItem>
                          <MenuItem value={20}>Twenty</MenuItem>
                          <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={12} sx={{margin:0.5}}>
                  <FormControl>
                      <FormLabel id="demo-controlled-radio-buttons-group">Product Status</FormLabel>
                      <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                      
                      >
                      <FormControlLabel value="0" control={<Radio />} label="IN STOCK" disabled/>
                      <FormControlLabel value="1" control={<Radio />} label="OUT OF STOCK" disabled/>
                    </RadioGroup>
                  </FormControl>
                  </Grid>
                  <Grid item>
                    <Button sx={{marginLeft:40,marginBottom:1}} variant="contained" color="error"
                    onClick={() => { navigate("/admin/products")}} >Back</Button>
                  </Grid>
                    </Paper>
                </Container>
              </div>
            </div>
        </div>
        </div>
  )
}

export default DetailsProduct