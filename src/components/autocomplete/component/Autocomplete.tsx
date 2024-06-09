import { useEffect, useRef } from 'react';
import './styles.css';
import { SmartComponentProps } from '../../../models/smartComponentProps';
import StoreCmpntAutocomplete from '../store/storeCmpntAutocomplete';
import { observer } from 'mobx-react';
import { AutocompleteItem } from '../models/autocompleteItem';
import { ChildrenProps } from '../../../models/childrenProps';

interface MenuItemProps {
    readonly item: AutocompleteItem;
}

function MenuItem(props: MenuItemProps) {
    return(
        <div className={'autocomplete_menuItem'}>
            <div className={'autocomplete_menuItemLineName'}>
                <span className={'autocomplete_menuItemImgContainer'}>
                    <img src={props.item.imgUrlFlag} />
                </span>
                <span>
                    {props.item.name}
                </span>
            </div>
            <div className={'autocomplete_menuItemLineFullName'}>{props.item.fullName}</div>
        </div>
    );

}

function MenuContainer(props: ChildrenProps){
    return (
        <div className={'autocomplete_munuWrapper'}>
            <div className={'autocomplete_menuContainer'}>
                {props.children}
            </div>
        </div>
    );
}

const Menu = observer((props: SmartComponentProps<StoreCmpntAutocomplete>) => {
    const isOpen = props.store.isOpen;

    if (!isOpen) {
        return null;
    }

    const itemsStatus = props.store.itemsStatus;

    if (itemsStatus.status === 'empty') {
        return (
            <MenuContainer>
                <div>
                    {'Нет вариантов'}
                </div>
            </MenuContainer>
        );
    }

    if (itemsStatus.status === 'loading') {
        return (
            <MenuContainer>
                <div>
                    {'Звгрузка...'}
                </div>
            </MenuContainer>
        );
    }

    return (
        <MenuContainer>
            {itemsStatus.itemsList.map(item => <MenuItem key={item.uuid} item={item} />)}
        </MenuContainer>
    );
});

const InputText = observer((props: SmartComponentProps<StoreCmpntAutocomplete>) => {
    const isOpen = props.store.isOpen;

    return (
        <input
            className={`autocomplete_input ${isOpen ? 'autocomplete_inputOpen' : 'autocomplete_inputClose'}`}
            type={'text'}
            value={props.store.value}
            onChange={props.store.eventChangeValue}
            onFocus={props.store.eventInputFocus}
        />
    );
});

function Autocomplete(props: SmartComponentProps<StoreCmpntAutocomplete>) {
    const containerRef = useRef<HTMLDivElement>(null);

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
            <InputText store={props.store} />
            <Menu store={props.store} />
        </div>
    );
}

export default Autocomplete;