import { ArrowDropDown } from '@mui/icons-material'
import {
    Autocomplete,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
} from '@mui/material'
import React from 'react'
// import {} from "@mui/material/Icon"
import ClearIcon from '@mui/icons-material/Clear'

const DetailDropdown = (props) => {
    let {
        value,
        onChange,
        label,
        items,
        handleClose,
        isCross,
        isCount,
        isSearch,
    } = props

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
            <FormControl sx={{ m: 1, minWidth: 200 }}>
                <InputLabel id="demo-simple-select-helper-label">
                    {label}
                </InputLabel>

                <Select
                    size="small"
                    labelId="demo-simple-select-helper-label"
                    value={value}
                    style={{ height: 55, width: 200 }}
                    onChange={(e) => onChange(e)}
                    label={label}
                    {...attr}
                >
                    {items?.map((data, idx) => {
                        return (
                            <MenuItem
                                key={idx}
                                value={isSearch ? data.username : data.name}
                            >
                                {isSearch ? data.username : data.name}{' '}
                                {isCount && data.count}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        </div>
    )
}

export default DetailDropdown
