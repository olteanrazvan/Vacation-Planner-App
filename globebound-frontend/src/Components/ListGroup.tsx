import React, {useState} from "react";

interface ListGroupProps{
    items: string[];
    heading: string;
    onSelectItem: (item: string) => void;
}

function ListGroup({items, heading, onSelectItem}: ListGroupProps) {
    const [selectedItem, setSelectedItem] = useState(-1);
    const message = items.length === 0 ? <h2>no items found</h2> : null;
    const getMessage = () => {
        return items.length === 0 && <h2>no items found</h2>
    }
    const handleClick = (event: MouseEvent) => console.log(event);
    // @ts-ignore
    return (
        <>
            <h1>{heading}</h1>
            {message}
            {getMessage()}
            <ul className="list-group">
                {items.map((item, index) => <li
                    className={ selectedItem === index ? "list-group-item active" : "list-group-item"}
                    key={item}
                    onMouseOver={()=> {setSelectedItem(index)}}
                    onClick={() => onSelectItem(item)}>{item}
                </li>)}
            </ul>
        </>
    );
}
export default ListGroup;