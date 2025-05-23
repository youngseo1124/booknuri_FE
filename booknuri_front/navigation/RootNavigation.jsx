import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * 화면 전환 시 애니메이션 없이 깔끔하게 교체하고 싶을 때 사용
 * (기존 reset은 애니메이션 있음)
 */
export function reset(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(name, params));
    }
}
