import "./App.css";
import { Autocomplete } from "./components/autocomplete";
import { ContentContainer } from "./components/contentContainer";
import { TextWithButtons } from "./components/textWithButtons";
import { SmartComponentProps } from "./models/smartComponentProps";
import StoreMain from "./storeMain";

function App(props: SmartComponentProps<StoreMain>) {
  return (
    <div className={'app_container'}>
      <ContentContainer>
        <TextWithButtons store={props.store.storeTextWithButtons1} />
      </ContentContainer>

      <ContentContainer>
        <TextWithButtons store={props.store.storeTextWithButtons2} />
      </ContentContainer>

      <ContentContainer>
        <Autocomplete store={props.store.storeCmpntAutocomplete1}/>
      </ContentContainer>

      <ContentContainer>
        <Autocomplete store={props.store.storeCmpntAutocomplete2}/>
      </ContentContainer>
    </div>
  );
}

export default App;
