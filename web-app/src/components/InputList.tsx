import react from "react"

type ItemListProps = {
    items: string[]
}

const InputList : React.FC<ItemListProps> = ({items}) => {
    
    
    return <div>
        <h2>Inputs</h2>
        <ul>
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    </div>
}

export default InputList