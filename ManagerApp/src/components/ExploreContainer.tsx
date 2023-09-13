import { IonGrid, IonRow } from '@ionic/react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores/reducers';
import './ExploreContainer.css';
import { FeatureAppCard} from './features/FeatureAppCard';

interface ContainerProps { }

const ExploreContainer: React.FC<ContainerProps> = () => {
  const userProfile = useSelector((state:RootState)=> state.Login_Info.info?.userProfile);
  if(userProfile){
    return (
      <div className="container container-with-header">
        <IonGrid>
          <IonRow>
        {
          //userProfile.activatedRole.role.appFeatures
          userProfile.activatedRole.role.appFeatures.map((f:any)=>(<FeatureAppCard key={f.id} item={f}/>))
        }
        </IonRow>
        </IonGrid>
      </div>
    );
  }else{
    return (
      <div className="container">
        
        <strong>TITLE</strong>
          <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
      </div>
    );
  }
  
  
};

export default ExploreContainer;
