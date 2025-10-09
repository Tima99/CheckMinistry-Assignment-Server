export default function formatOrdersWithCount(
    orderRows: {
      id: number;
      orderDescription: string;
      createdAt: Date;
      _count: { orderMaps: number };
    }[]
  ) {
    return orderRows.map((order) => {
      return {
        ...order,
        count: order._count.orderMaps,
        //  remove fields
        _count: undefined,
      };
    });
  }
  