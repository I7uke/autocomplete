import "./App.css";
import { ContentContainer } from "./components/contentContainer";
import { TextWithButtons } from "./components/textWithButtons";
import { SmartComponentProps } from "./models/smartComponentProps";
import StoreMain from "./storeMain";

function App(props: SmartComponentProps<StoreMain>) {
  return (
    <div>

      <ContentContainer>
        <TextWithButtons store={props.store.storeTextWithButtons1} />
      </ContentContainer>

      <ContentContainer>
        <TextWithButtons store={props.store.storeTextWithButtons2} />
      </ContentContainer>
    </div>
  );
}

export default App;
