import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/constants/theme';
import HeaderLeft from '@/components/HeaderLeft';

export default function DrawerMenuButton() {
  const navigation = useNavigation<DrawerNavigationProp<Record<string, object>>>();
  const { t } = useTranslation();
  return (
    <HeaderLeft
      icon={'menu'}
      accessibilityLabel={t('nav.openMenu')}
      onPress={() => navigation.toggleDrawer()}
      style={{ marginLeft: spacing.xs }}
    />
  );
}
