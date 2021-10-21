import { MWViewPlugin } from "MountainWorkspace/MWViewPlugin"
import RunOverviewView from "./RunOverviewView"

const runOverviewPlugin: MWViewPlugin = {
    name: 'runOverview',
    label: 'Run overview',
    component: RunOverviewView,
    singleton: true,
    icon: undefined
}

export default runOverviewPlugin