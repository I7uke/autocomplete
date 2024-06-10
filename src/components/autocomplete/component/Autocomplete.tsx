import { useEffect, useRef, useState } from 'react';
import './styles.css';
import { SmartComponentProps } from '../../../models/smartComponentProps';
import StoreCmpntAutocomplete from '../store/storeCmpntAutocomplete';
import { observer } from 'mobx-react';
import { AutocompleteItem } from '../models/autocompleteItem';
import { ChildrenProps } from '../../../models/childrenProps';
import { ReactComponent as SvgNoData } from '../svg/noData.svg';
import { ReactComponent as SvgTriangleDownFilled } from '../svg/triangleDownFilled.svg';
import { ReactComponent as SvgClear } from '../svg/clear.svg';
import { ReactComponent as SvgPictureOutlined } from '../svg/pictureOutlined.svg';
import { LoaderDots } from '../../loaderDots';

function ItemImage(props: Pick<AutocompleteItem, 'imgUrlFlag'>) {
    // Статус ошибки загрузки картинки
    const [isError, setStatusError] = useState(false);

    if (isError) {
        // Если не удалось получить картинку устанавливаем заглушку
        return (
            <span className={'autocomplete_menuItemImgContainer'}>
                <SvgPictureOutlined />
            </span>
        );
    }

    return (
        <span className={'autocomplete_menuItemImgContainer'}>
            <img 
            src={props.imgUrlFlag} 
            onError={()=>setStatusError(true)}
            />
        </span>
    );
}

interface MenuItemProps {
    readonly item: AutocompleteItem;
    readonly eventSelectItem: (e: React.MouseEvent<HTMLElement, MouseEvent>)=>void;
}

function MenuItem(props: MenuItemProps) {
    return(
        <div
            className={'autocomplete_menuItem'}
            data-uuid={props.item.uuid}
            onClick={props.eventSelectItem}
        >
            <div className={'autocomplete_menuItemLineName'}>
                <ItemImage imgUrlFlag={props.item.imgUrlFlag}/>
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
                <div className={'autocomplete_noDataLineSvg'}>
                    <SvgNoData />
                </div>
                <div className={'autocomplete_noDataLineText'}>
                    {'Нет вариантов'}
                </div>
            </MenuContainer>
        );
    }

    if (itemsStatus.status === 'loading') {
        return (
            <MenuContainer>
                <div className={'autocomplete_loaderContainer'}>
                    <LoaderDots />
                </div>
            </MenuContainer>
        );
    }

    return (
        <MenuContainer>
            {itemsStatus.itemsList.map(item =>
                <MenuItem
                    key={item.uuid}
                    item={item}
                    eventSelectItem={props.store.eventSelectItem}
                />
            )}
        </MenuContainer>
    );
});

const InputText = observer((props: SmartComponentProps<StoreCmpntAutocomplete>) => {
    const isOpen = props.store.isOpen;

    return (
        <div className={'autocomplete_inputContainer'}>
            <input
                className={`autocomplete_input ${isOpen ? 'autocomplete_inputOpen' : 'autocomplete_inputClose'}`}
                type={'text'}
                value={props.store.value}
                onChange={props.store.eventChangeValue}
                onFocus={props.store.eventInputFocus}
            />
            <div className={'autocomplete_inputButtonsContainer'}>
                {
                    props.store.value ?
                        <button
                            title={'Очистить'}
                            onClick={props.store.eventClear}
                            className={'autocomplete_button'}>
                            <SvgClear />
                        </button> : null
                }
                <button
                    title={isOpen ? 'Закрыть' : 'Открыть'}
                    className={isOpen ? 'autocomplete_buttonOpen autocomplete_button' : 'autocomplete_button'}
                    onClick={props.store.eventToggleOpenClose}
                >
                    <SvgTriangleDownFilled />
                </button>
            </div>
        </div>
    );
});

function Autocomplete(props: SmartComponentProps<StoreCmpntAutocomplete>) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Слушатель, ели клик за пределами компонента, закрыть меню
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