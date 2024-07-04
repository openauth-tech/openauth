export const Checker = ({ id, label }: { id: string; label: string }) => {
  return (
    <Label
      htmlFor={id}
      className="py-2 px-3 flex-center justify-between border-border border-1 border-solid rounded-lg cursor-pointer"
    >
      <Label className="text-sm capitalize font-bold">{label}</Label>
      <Checkbox id={id} />
    </Label>
  )
}
