import { ArrowDropDown } from '@mui/icons-material'
import {
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material'
import React from 'react'
import ClearIcon from '@mui/icons-material/Clear'

const StatusDropdown = (props) => {
    let { value, onChange, label, items, isCross, handleClose, isCount } = props

    value = value ?? ''

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
                            <ArrowDropDown />
                        </>
                    )}
                </>
            )
        }
    }

    return (
        <div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-helper-label">
                    {label}
                </InputLabel>
                <Select
                    style={{ height: 55, width: 200 }}
                    labelId="demo-simple-select-helper-label"
                    value={value}
                    onChange={(e) => onChange(e)}
                    label={label}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    {...attr}
                >
                    {items?.map((data, idx) => {
                        return (
                            <MenuItem key={idx} value={data.name ? data.name : data.status}>
                                {data.name ? data.name : data.status} {isCount && data.count}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    )
}

export default StatusDropdown
