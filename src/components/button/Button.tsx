import './styles.css';

interface Props {
    readonly text: string;
    readonly onClick?: () => void;
    readonly type?: 'primary' | 'secondary';
    readonly disabled?: boolean;
}

export default function Button(props: Props) {
    let cssClassType: string = 'button_buttonPrimary';

    if(props.type === 'secondary') {
        cssClassType = 'button_buttonSecondary';
    }

    return (
        <button
            className={`button_button ${cssClassType}`}
            disabled={props.disabled}
            onClick={props.disabled ? undefined : props.onClick}
        >
            {props.text}
        </button>
    );
}