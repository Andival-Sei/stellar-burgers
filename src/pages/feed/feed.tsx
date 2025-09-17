import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed } from '@slices/feeds';
import { selectFeed, selectFeedsLoading } from '@selectors/feeds';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const feed = useSelector(selectFeed);
  const isLoading = useSelector(selectFeedsLoading);

  useEffect(() => {
    // Запрашиваю ленту при заходе на страницу
    dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading || !feed) {
    return <Preloader />;
  }

  return (
    <FeedUI orders={feed.orders} handleGetFeeds={() => dispatch(fetchFeed())} />
  );
};
