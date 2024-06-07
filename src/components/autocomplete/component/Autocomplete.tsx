import { useEffect, useRef } from 'react';
import './styles.css';
import { SmartComponentProps } from '../../../models/smartComponentProps';
import StoreCmpntAutocomplete from '../store/storeCmpntAutocomplete';
import { observer } from 'mobx-react';

const Menu = observer((props: SmartComponentProps<StoreCmpntAutocomplete>) => {
    const isOpen = props.store.isOpen;

    if (!isOpen) {
        return null;
    }

    return (
        <div className={'autocomplete_munuWrapper'}>
            <div className={'autocomplete_menuContainer'}>
                <div>{'item 0'}</div>
                <div>{'item 1'}</div>
                <div>{'item 2'}</div>
                <div>{'item 3'}</div>
                <div>{'item 4'}</div>
                <div>{'item 5'}</div>
                <div>{'item 6'}</div>
                <div>{'item 7'}</div>
                <div>{'item 8'}</div>
                <div>{'item 9'}</div>
            </div>
        </div>
    );
})



function Autocomplete(props: SmartComponentProps<StoreCmpntAutocomplete>) {
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const listener = (e: MouseEvent) => {
            if (containerRef.current) {
                if (e.target instanceof Element) {
                    if (!containerRef.current.contains(e.target)) {
                        props.store.setStatusOpen(false);
                    }
                }
            }
        }

        document.addEventListener('click', listener);

        return () => {
            document.removeEventListener('click', listener);
        }
    }, []);

    return (
        <div
            ref={containerRef}
        >
            <input
                className={'autocomplete_input'}
                type={'text'}
                onFocus={props.store.eventInputFocus}
                ref={inputRef}
            />
            <Menu store={props.store} />
        </div>
    );
}

export default Autocomplete;