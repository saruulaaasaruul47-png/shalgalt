import Input from '../atoms/Input'

function SearchBar({ value, onChange, placeholder = 'Хайх...' }) {
  return (
    <div className="w-full">
      <Input value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  )
}

export default SearchBar
