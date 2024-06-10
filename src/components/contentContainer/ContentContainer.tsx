import { ChildrenProps } from "../../models/childrenProps";
import './styles.css';

export default function ContentContainer(props: ChildrenProps) {
    return(
        <div className={'contentContainer_container'}>
            {props.children}
        </div>
    );
}