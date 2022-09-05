import React, { Component } from 'react';
import { View,Text, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash'
import AppTheme from '../../utils/AppTheme';
import { MultiBrandingAction } from '../../flux/actions/apis/multiBranding';
import { LogoutAction } from '../../flux/actions/apis/LogoutAction';
import APITransport from '../../flux/actions/transport/apitransport';
import Brands from '../common/components/Brands';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Assets } from '../../assets';
import { checkNetworkConnectivity, monospace_FF } from '../../utils/CommonUtils';
import Spinner from '../common/components/loadingIndicator';
import { storeFactory } from '../../flux/store/store';
import constants from '../../flux/actions/constants';
import { GetStudentsAndExamData } from '../../flux/actions/apis/getStudentsAndExamData';
import { getMinimalValue } from '../../utils/StorageUtils';
import { getBrandingDataApi, getStudentExamApi, setBrandingDataApi, setStudentExamApi } from '../../utils/offlineStorageUtils';

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
        this.onBack = this.onBack.bind(this)
    }
    componentDidMount() {
        const { navigation } = this.props;
        if (this.props.minimalFlag) {
            navigation.addListener('willFocus', async payload => {
                BackHandler.addEventListener('hardwareBackPress', this.onBack)
            })
            this.willBlur = navigation.addListener('willBlur', payload =>
                BackHandler.removeEventListener('hardwareBackPress', this.onBack)
            );
        }
        
        this.callMultiBrandingActiondata()
    }

   async componentDidUpdate(prevProps) {
        const { studentsAndExamData, multiBranding, loginData, minimalFlag }  = this.props;

        const { loginData: { data: { school } } } = this.props;
        let hasNetwork = await checkNetworkConnectivity();
        
        if (multiBranding && prevProps.multiBranding != multiBranding) {
            if (multiBranding.status && multiBranding.status == 200) {

                //set minimal Flag
                let isMinimalMode = await getMinimalValue();
                storeFactory.dispatch(this.minimalFlagAction( isMinimalMode == null ? false : isMinimalMode));

                //calling students and exam api if minimal mode true
                if (isMinimalMode) {
                    this.callStudentsData(this.props.loginData.data.token)
                } else {
                    this.setState({isLoading : false})
                }
                
                if (loginData.data.school.hasOwnProperty("offline") && loginData.data.school.offline && hasNetwork & minimalFlag ) {
                    let getBrandingCache = await getBrandingDataApi();
                    if (getBrandingCache != null) {

                        let data = getBrandingCache.filter((e)=> {
                            if (e.key == loginData.data.school.schoolId) {
                                return true
                            }
                        });

                            if (data.length > 0) {
                                for (let element of getBrandingCache) {
                                    if (element.key == data[0].key) {
                                        element.data = multiBranding
                                        break;
                                    }
                                };
                            } else {
                                let payload = {
                                    key: `${loginData.data.school.schoolId}`,
                                    data: multiBranding
                                }
                                getBrandingCache.push(payload);
                            }
                        await setBrandingDataApi(getBrandingCache);
                    } else {
                        let payload = {
                            key: `${loginData.data.school.schoolId}`,
                            data: multiBranding
                        }
                        await setBrandingDataApi([payload])
                    }
                }
            }
        }

        if (studentsAndExamData &&  prevProps.studentsAndExamData != studentsAndExamData ) {
            if (studentsAndExamData.status && studentsAndExamData.status == 200) {
                this.setState({isLoading : false})
                if (loginData.data.school.hasOwnProperty("offline") && loginData.data.school.offline && minimalFlag && hasNetwork) {
                    let getStudentExamCache = await getStudentExamApi(0,0);
                    if (getStudentExamCache != null) {

                        let data = getStudentExamCache.filter((e)=> {
                            if (e.key == loginData.data.school.schoolId) {
                                return true
                            }
                        });
                        if (data.length > 0) {
                            for (let element of getStudentExamCache) {
                                if (element.key == data[0].key) {
                                    element.data = studentsAndExamData
                                    break;
                                }
                            };
                        } else {
                            let payload = {
                                key: `${loginData.data.school.schoolId}`,
                                data: studentsAndExamData
                            }
                            getStudentExamCache.push(payload);
                        }
                        await setStudentExamApi(getStudentExamCache, 0, 0);
                    } else {
                        let payload = {
                            key: `${loginData.data.school.schoolId}`,
                            data: studentsAndExamData
                        }
                        await setStudentExamApi([payload], 0, 0);
                        }
                }
            }
        }
    }
    

    callStudentsData = async (token) => {

        let hasNetwork = await checkNetworkConnectivity();


        if (!hasNetwork) {
            let hasCacheData = await getStudentExamApi(0,0);
            if (hasCacheData) {
                let cacheFilterData =  hasCacheData.filter((element)=>{
                    if (element.key == this.props.loginData.data.school.schoolId) {
                        return true
                    }
                });
                storeFactory.dispatch(this.dispatchStudentExamData(cacheFilterData[0].data))
            } else {
                //Alert message show message "something went wrong or u don't have cache in local"            
            }
        } else {
            let dataPayload = {
                "classId": "0",
                "section": "0"
            }
            this.setState({
                isLoading: true,
            })
            let apiObj = new GetStudentsAndExamData(dataPayload, token);
            this.props.APITransport(apiObj)
        }
    }

    dispatchStudentExamData(payload){
        return {
            type: constants.GET_STUDENTS_EXAMS_LIST,
            payload
        }
    }

   minimalFlagAction (payload){
    return {
        type: constants.MINIMAL_FLAG,
        payload
    }
}

   async callMultiBrandingActiondata() {
        let hasNetwork = await checkNetworkConnectivity();
        if (!hasNetwork) {
            let hasCacheData = await getBrandingDataApi();
            if (hasCacheData) {
            let cacheFilterData =  hasCacheData.filter((element)=>{
                if (element.key == this.props.loginData.data.school.schoolId) {
                    return true
                }
            });
                storeFactory.dispatch(this.dispatchBrandingDataApi(cacheFilterData[0].data))
            } else {
                //Alert message show message "something went wrong or u don't have cache in local"
            }
        } else {
        let payload = this.props.multiBrandingData
        let token = this.props.loginData.data.token
        let apiObj = new MultiBrandingAction(payload, token);
        this.props.APITransport(apiObj)
    }
}

dispatchBrandingDataApi(payload) {
    return {
        type: constants.MULTI_BRANDING,
        payload
    }
    }

    onBack = () => {
        const { navigation } = this.props;
        BackHandler.exitApp()
        // navigation.goBack();
        return true
    }

    render() {
        const { isLoading } = this.state;
        if(this.props.multiBrandingData === undefined || this.props.multiBrandingData === null || this.state.isLoading){
           
            return <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
            {

                this.state.isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', fontFamily : monospace_FF }}>Loading Branding ...</Text>
                    </View> :
                        <Brands
                            Image1={Assets.AppLogo}
                            appName={'Saral OCR App'}
                            themeColor={AppTheme.BLUE}
                            onPress={() => this.props.navigation.navigate('selectDetails')}
                        />
            }
        </View>

        }
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                            <Brands
                                Image={this.props.multiBrandingData && 'data:image/png;base64,' + this.props.multiBrandingData.logoImage}
                                appName={this.props.multiBrandingData && this.props.multiBrandingData.appName}
                                themeColor={this.props.multiBrandingData && this.props.multiBrandingData.themeColor1}
                                onPress={() => this.props.minimalFlag ? this.props.navigation.navigate("myScan") : this.props.navigation.navigate('selectDetails')}
                            /> 
                            {
                    isLoading
                    &&
                    <Spinner
                        animating={isLoading}
                        customContainer={{ opacity: 0.6, elevation: 15 }}
                    />
                }
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        multiBrandingData: state.multiBrandingData.response.data,
        multiBranding: state.multiBrandingData.response,
        minimalFlag: state.minimalFlag,
        studentsAndExamData: state.studentsAndExamData
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        LogoutAction: LogoutAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);
