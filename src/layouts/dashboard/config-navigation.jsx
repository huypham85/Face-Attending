import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'Người dùng',
    path: '/users',
    icon: icon('ic_user'),
  },
  {
    title: 'Khoá học',
    path: '/courses',
    icon: icon('book-svgrepo-com'),
  },
  {
    title: 'Giảng viên',
    path: '/teachers',
    icon: icon('ic_user'),
  },
  {
    title: 'Sinh viên',
    path: '/students',
    icon: icon('ic_user'),
  },
];

export default navConfig;
