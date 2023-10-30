import {
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material'
import React from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClearIcon from '@mui/icons-material/Clear'

const Dropdown = (props) => {
    let { value, onChange, label, items, isCross, handleClose } = props

    value = value ? value : ''

    let attr = {}
    if (value) {
        attr['IconComponent'] = () => {
            return (
                <>
                    {value && isCross ? (
                        <>
                            <IconButton
                                size="small"
                                edge="end"
                                onClick={handleClose}
                                aria-label="close"
                            >
                                <ClearIcon />
                            </IconButton>
                        </>
                    ) : (
                        <>
                            <ArrowDropDownIcon />
                        </>
                    )}
                </>
            )
        }
    }

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-helper-label">
                    {label}
                </InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    value={value}
                    // onChange={handleChange}
                    onChange={(e) => onChange(e)}
                    label={label}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    {...attr}
                >
                    {items?.map((data, idx) => {
                        return (
                            <MenuItem key={idx} value={data.name}>
                                {data.name} {data.count}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    )
}

export default Dropdown
