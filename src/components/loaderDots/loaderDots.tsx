import './styles.css';

export default function LoaderDots(){
    return(
        <div className={'loaderDots_spinnerBox'}>
            <div className={'loaderDots_pulseContainer'}>
                <div className={'loaderDots_pulseBubble loaderDots_pulseBubble1'}/>
                <div className={'loaderDots_pulseBubble loaderDots_pulseBubble2'}/>
                <div className={'loaderDots_pulseBubble loaderDots_pulseBubble3'}/>
            </div>
        </div>
    );
}

