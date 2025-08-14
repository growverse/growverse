// No React import needed for JSX in React 18+

export interface NameTagProps {
  name?: string;
}

export function NameTag({ name = 'macaris64' }: NameTagProps): JSX.Element {
  return (
    <div className="name-tag" id="nameTag">
      {name}
    </div>
  );
}
