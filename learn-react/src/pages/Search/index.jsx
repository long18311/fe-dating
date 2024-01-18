import  { useEffect, useState } from 'react';
import Autosuggest from 'react-autosuggest';
import { useNavigate } from 'react-router-dom';
import AxiosClient from '../../apis/AxiosClient';
import {checkToken} from "../../utils/index.js";

function SearchBar() {
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (checkToken()){
            navigate("/loginpage")
            return;
        }
        AxiosClient.get('getAllUser')
            .then((res) => {
                if (res && Array.isArray(res)) {
                    setUsers(res);
                }
                console.log(res)
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const getSuggestions = (input) => {
        const inputValue = input.trim().toLowerCase();
        if (inputValue === '') {
            return [];
        }

        const filteredUsers = users.filter(
            (user) =>
                user.firstname?.toLowerCase().includes(inputValue) ||
                user.lastname?.toLowerCase().includes(inputValue)
        );

        return filteredUsers;
    };

    const onSuggestionsFetchRequested = ({ value }) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event, { suggestion }) => {
        if (suggestion) {
            navigate(`/profile/${suggestion.id}`);
        }
    };

    const onChange = (event, { newValue }) => {
        setValue(newValue);
    };

    const renderSuggestion = (suggestion) => (
        <div className="max-h-[250px] overflow-y-auto w-2.5/3">
            <div className="p-2 hover:bg-gray-100 cursor-pointer">
                <img className="h-8 w-8 rounded-full" src={suggestion.avatar ?? 'default_avatar_url'} alt="" />
                <span>
                {suggestion.lastname ?? 'Unknown'} {suggestion.firstname ?? 'Name'}
            </span>
                <i className="fas fa-book ml-2 "></i>
                <span className="ml-2">{suggestion.city ?? 'Unknown City'}</span>
                <i className="fas fa-heart ml-2 "></i>
                <span className="ml-2 text-blue-950">{suggestion.maritalstatus ?? 'Unknown'}</span>
            </div>
        </div>
    );


    const inputProps = {
        placeholder: 'Bắt đầu bằng chữ cái hoặc tên...',
        value,
        onChange: onChange,
        className: 'p-2 border rounded-lg focus:outline-none w-80 mr-20',
    };

    return (
        <div>
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                onSuggestionsClearRequested={onSuggestionsClearRequested}
                onSuggestionSelected={onSuggestionSelected}
                getSuggestionValue={(suggestion) => suggestion.firstname + ' ' + suggestion.lastname}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                renderSuggestionsContainer={({ containerProps, children }) => (
                    <div {...containerProps} className="max-h-[250px] overflow-y-auto">
                        {children}
                    </div>
                )}
            />
        </div>
    );

}

export default SearchBar;
