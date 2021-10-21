import { MWViewPlugin } from "MountainWorkspace/MWViewPlugin"
import ParameterView from "./ParameterView"

const parameterPlugin = (parameterName: string): MWViewPlugin => ({
    name: `p:${parameterName}`,
    label: `p:${parameterName}`,
    component: ParameterView,
    additionalProps: {parameterName},
    singleton: true,
    icon: undefined
})

export default parameterPlugin