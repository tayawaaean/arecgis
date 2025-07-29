<Drawer
anchor="right"
open={openDrawer}
onClose={handleDrawerClose}
>
<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 1, py: 2 }}>
  <Typography variant="h6" sx={{ ml: 1 }}>
    Filters
  </Typography>
  <IconButton onClick={handleDrawerClose}>
    <CloseIcon />
  </IconButton>
</Stack>

<Divider />
<Stack spacing={3} sx={{ p: 3 }}>
  <div>
    <Typography variant="h6" gutterBottom>
      RE categories
    </Typography>
    <FormGroup>
      {category.map((type, index) => (
        <div key={index}>
          <FormControlLabel
            label={type.contName}
            key={index}
            control={
              <Checkbox
                checked={type.checked}
                indeterminate={type.contName === 'Solar Energy' ? (rawSolarUsage.map(item => solarUsageFilter.indexOf(item.name)).includes(-1)) || (solarProvince.map(item => solarProvFilter.indexOf(item)).includes(-1)) :
                  type.contName === 'Biomass' ? (rawBiomassPriUsage.map(item => biomassUsageFilter.indexOf(item.name)).includes(-1)) || (biomassProvince.map(item => bioProvFilter.indexOf(item)).includes(-1)) :
                    type.contName === 'Wind Energy' ? (rawWindUsage.map(item => windUsageFilter.indexOf(item.name)).includes(-1)) || (windProvince.map(item => windProvFilter.indexOf(item)).includes(-1)) : false}
                onChange={handleChange(type.contName, index)}
              />
            }
          />

          {!filters.contNames.includes(type.contName) ?
            <div>
              <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="multiple-checkbox-label">Select Usage</InputLabel>
                {type.contName === 'Solar Energy' ? <Select
                  id="multiple-checkbox"
                  multiple
                  value={solarUsageFilter}
                  onChange={onSolarChecked}
                  input={<OutlinedInput label="Select Usage" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {rawSolarUsage.map((value, index) => (
                    <MenuItem key={index} value={value.name}>
                      <Checkbox checked={solarUsageFilter.indexOf(value.name) > -1} />
                      <ListItemText primary={value.name} />
                    </MenuItem>
                  ))}
                </Select> : type.contName === 'Biomass' ? <Select
                  id="multiple-checkbox"
                  multiple
                  value={biomassUsageFilter}
                  onChange={onBiomassChecked}
                  input={<OutlinedInput label="Select Usage" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {rawBiomassPriUsage.map((value, index) => (
                    <MenuItem key={index} value={value.name}>
                      <Checkbox checked={biomassUsageFilter.indexOf(value.name) > -1} />
                      <ListItemText primary={value.name} />
                    </MenuItem>
                  ))}
                </Select> : type.contName === 'Wind Energy' ? <Select
                  id="multiple-checkbox"
                  multiple
                  value={windUsageFilter}
                  onChange={onWindChecked}
                  input={<OutlinedInput label="Select Usage" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {rawWindUsage.map((value, index) => (
                    <MenuItem key={index} value={value.name}>
                      <Checkbox checked={windUsageFilter.indexOf(value.name) > -1} />
                      <ListItemText primary={value.name} />
                    </MenuItem>
                  ))}
                </Select> : type.contName === 'Hydropower' ? <Select
                  id="multiple-checkbox"
                  multiple
                  value={['not availble']}
                  onChange={onWindChecked}
                  input={<OutlinedInput label="Not yet available" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  <MenuItem key={Math.random()} value={['not available']}>
                    <Checkbox checked={true} />
                    <ListItemText primary={['not available']} />
                  </MenuItem>
                </Select> : ''}

              </FormControl>
            </div>
            : null}

          {!filters.contNames.includes(type.contName) ? <div>
            <FormControl sx={{ m: 1, width: 300 }}>
              <InputLabel id="multiple-checkbox-label">Select City/Municipality</InputLabel>
              {type.contName === 'Solar Energy' && solarProvFilter ? <Select
                id="demo-multiple-checkbox"
                multiple
                value={solarProvFilter}
                onChange={onChangeSolarProv}
                input={<OutlinedInput label="Select City/Municipality" />}
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {solarProvince.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={solarProvFilter.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
                : type.contName === 'Biomass' ? <Select
                  id="demo-multiple-checkbox"
                  multiple
                  value={bioProvFilter}
                  onChange={onChangeBioProv}
                  input={<OutlinedInput label="Select City/Municipality" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {biomassProvince.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={bioProvFilter.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select> : type.contName === 'Wind Energy' ? <Select
                  id="demo-multiple-checkbox"
                  multiple
                  value={windProvFilter}
                  onChange={onChangeWindProv}
                  input={<OutlinedInput label="Select City/Municipality" />}
                  renderValue={(selected) => selected.join(', ')}
                  MenuProps={MenuProps}
                >
                  {windProvince.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={windProvFilter.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select> : <FadeLoader height={10} color={"#fffdd0"} />
              }

            </FormControl>
          </div> : null}

        </div>
      ))}
    </FormGroup>
  </div>

</Stack>

<Box sx={{ p: 3 }}>
  <Button
    fullWidth
    size="large"
    type="submit"
    color="inherit"
    variant="outlined"
    startIcon={<ClearAllIcon />}
    onClick={clearAll}
  >
    Clear All
  </Button>
</Box>
</Drawer>